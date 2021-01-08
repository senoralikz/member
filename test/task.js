process.env.TESTENV = true

let Task = require('../app/models/task.js')
let User = require('../app/models/user')

const crypto = require('crypto')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()

chai.use(chaiHttp)

const token = crypto.randomBytes(16).toString('hex')
let userId
let taskId

describe('Tasks', () => {
  const taskParams = {
    title: '13 JavaScript tricks SEI instructors don\'t want you to know',
    text: 'You won\'believe number 8!'
  }

  before(done => {
    Task.deleteMany({})
      .then(() => User.create({
        email: 'caleb',
        hashedPassword: '12345',
        token
      }))
      .then(user => {
        userId = user._id
        return user
      })
      .then(() => Task.create(Object.assign(taskParams, {owner: userId})))
      .then(record => {
        taskId = record._id
        done()
      })
      .catch(console.error)
  })

  describe('GET /tasks', () => {
    it('should get all the tasks', done => {
      chai.request(server)
        .get('/tasks')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.tasks.should.be.a('array')
          res.body.tasks.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('GET /tasks/:id', () => {
    it('should get one task', done => {
      chai.request(server)
        .get('/tasks/' + taskId)
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.task.should.be.a('object')
          res.body.task.title.should.eql(taskParams.title)
          done()
        })
    })
  })

  describe('DELETE /tasks/:id', () => {
    let taskId

    before(done => {
      Task.create(Object.assign(taskParams, { owner: userId }))
        .then(record => {
          taskId = record._id
          done()
        })
        .catch(console.error)
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .delete('/tasks/' + taskId)
        .set('Authorization', `Bearer notarealtoken`)
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should be succesful if you own the resource', done => {
      chai.request(server)
        .delete('/tasks/' + taskId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should return 404 if the resource doesn\'t exist', done => {
      chai.request(server)
        .delete('/tasks/' + taskId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('POST /tasks', () => {
    it('should not POST an task without a title', done => {
      let noTitle = {
        text: 'Untitled',
        owner: 'fakedID'
      }
      chai.request(server)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ task: noTitle })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not POST an task without text', done => {
      let noText = {
        title: 'Not a very good task, is it?',
        owner: 'fakeID'
      }
      chai.request(server)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ task: noText })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not allow a POST from an unauthenticated user', done => {
      chai.request(server)
        .post('/tasks')
        .send({ task: taskParams })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should POST an task with the correct params', done => {
      let validTask = {
        title: 'I ran a shell command. You won\'t believe what happened next!',
        text: 'it was rm -rf / --no-preserve-root'
      }
      chai.request(server)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ task: validTask })
        .end((e, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('task')
          res.body.task.should.have.property('title')
          res.body.task.title.should.eql(validTask.title)
          done()
        })
    })
  })

  describe('PATCH /tasks/:id', () => {
    let taskId

    const fields = {
      title: 'Find out which HTTP status code is your spirit animal',
      text: 'Take this 4 question quiz to find out!'
    }

    before(async function () {
      const record = await Task.create(Object.assign(taskParams, { owner: userId }))
      taskId = record._id
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .patch('/tasks/' + taskId)
        .set('Authorization', `Bearer notarealtoken`)
        .send({ task: fields })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should update fields when PATCHed', done => {
      chai.request(server)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ task: fields })
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('shows the updated resource when fetched with GET', done => {
      chai.request(server)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.task.title.should.eql(fields.title)
          res.body.task.text.should.eql(fields.text)
          done()
        })
    })

    it('doesn\'t overwrite fields with empty strings', done => {
      chai.request(server)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ task: { text: '' } })
        .then(() => {
          chai.request(server)
            .get(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              // console.log(res.body.task.text)
              res.body.task.title.should.eql(fields.title)
              res.body.task.text.should.eql(fields.text)
              done()
            })
        })
    })
  })
})
