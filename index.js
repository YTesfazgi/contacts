import path from 'path'
import Fastify from 'fastify'
import fastifyFormbody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import fastifyPostgres from '@fastify/postgres'

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyFormbody)
fastify.register(fastifyStatic, {
    root: path.join('/Users/yohanatesfazgi/Code/contact_list'),
    prefix: '/'
})
fastify.register(fastifyPostgres, {
    connectionString: 'postgres://postgres@localhost/test'
})  

// Route declarations
fastify.get('/', function (request, reply) {
  reply.sendFile('index.html')
})

fastify.post('/add-contact', function (req, reply) {
    fastify.pg.query(
      'INSERT INTO contacts(name, birthday, relationship) VALUES ($1, $2, $3)', 
      [req.body.name, req.body.birthday, req.body.relationship],
      function onResult (err, result) {
        reply.send(err || result)
      }
    )
    reply.redirect('/')
})  

// Run server
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is listening on ${address}
})