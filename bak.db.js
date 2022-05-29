const { MongoClient } = require('mongodb')

require('dotenv').config({ path: __dirname + '/.env' })

async function main() {
  const uri = process.env.DB_URI
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connection open...')

    // await createPost(client, {
    //   title: 'Bockchain Decrypted',
    //   summary: "This website is for exploring the tech behind blockchain and it's impact on the world at large",
    //   author: 'The Chain Link',
    //   published: false,
    //   content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam magnam esse harum magni, totam numquam quaerat nemo necessitatibus animi expedita!"
    // })

    await getOnePost(client)
  } catch (e) {
    console.log('Unable to connect...')
    console.error(e)
  } finally {
    await client.close()
  }
}
main().catch(console.error)

async function createPost(client, newPost) {
  const result = await client
    .db('chainlink')
    .collection('post')
    .insertOne(newPost)

  console.log(`New post created with the following id: ${result.insertedId}`)
}

async function getOnePost(client) {
  const cursor = client.db('chainlink').collection('post').findOne({})
  const result = await cursor

  return result
  console.log(result)
}
