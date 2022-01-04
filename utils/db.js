import mongoose from 'mongoose'

const APP_IS_CONTAINER = false

// console.log(process.env.NODE_ENV)

const DB_STRING = APP_IS_CONTAINER
  ? 'mongodb://admin:password@mongodb'
  : 'mongodb://admin:password@localhost:27017'

const DATABASE = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return process.env.MONGODB_DEV
    case 'production':
      return process.env.MONGODB_PROD

    default:
      return process.env.MONGODB_TEST
  }
}

// const DATABASE = process.env.MONGODB_DEV

const connection = {}

async function connect() {
  if (connection.isConnected) {
    console.log('already connected')
    return
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      console.log('use previous connection')
      return
    }
    await mongoose.disconnect()
  }

  const db = await mongoose.connect(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DATABASE(),
  })
  console.log('new connection')
  connection.isConnected = db.connections[0].readyState
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect()
      connection.isConnected = false
    } else {
      console.log('not disconnected')
    }
  }
}

const drop = async () => {
  const collections = await db.listCollections().toArray()
  collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db.dropCollection(collectionName)
    })
}

const convertDocToObj = (doc) => {
  doc._id = doc._id.toString()
  doc.createdAt = doc.createdAt.toString()
  doc.updatedAt = doc.updatedAt.toString()
  return doc
}

const db = { connect, disconnect, convertDocToObj, drop }

export default db
