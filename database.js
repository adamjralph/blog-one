const { MongoClient } = require('mongodb')

async function main() {
  const uri =
    'mongodb+srv://dbadmin:<password>@cluster0.u8vh2.mongodb.net/?retryWrites=true&w=majority'

  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log('Connection open...')

    // await createLising(client, {
    //   name: 'Lovely Loft',
    //   summary: "A charming loft in Paris",
    //   bedrooms: 1,
    //   bathrooms: 1
    // })

    //     await createMultipleListings(client, [{
    //       name: "Infinite Views",
    //       summary: "Modern home with infinite views from the infinity pool",
    //       property_type: "House",
    //       bedrooms: 5,
    //       bathrooms: 4.5,
    //       beds: 5
    //   },
    //   {
    //       name: "Private room in London",
    //       property_type: "Apartment",
    //       bedrooms: 1,
    //       bathroom: 1
    //   },
    //   {
    //       name: "Beautiful Beach House",
    //       summary: "Enjoy relaxed beach living in this house with a private beach",
    //       bedrooms: 4,
    //       bathrooms: 2.5,
    //       beds: 7,
    //       last_review: new Date()
    //   }
    //  ])

    // await findOneListingByName(client, 'Infinite Views')

    await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
      minimumNumberOfBedrooms: 4,
      minimumNumberOfBathrooms: 2,
      maximumNumberOfResults: 5,
    })
  } catch (e) {
    console.error(e)
  } finally {
    await client.close()
  }
}

main().catch(console.error)

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
  client,
  {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER,
  } = {}
) {
  const cursor = client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .find({
      bedrooms: { $gte: minimumNumberOfBedrooms },
      bathrooms: { $gte: minimumNumberOfBathrooms },
    })
    .sort({ last_review: -1 })
    .limit(maximumNumberOfResults)

  const results = await cursor.toArray()

  if (results.length > 0) {
    console.log(
      `Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`
    )
    results.forEach((result, i) => {
      date = new Date(result.last_review).toDateString()

      console.log()
      console.log(`${i + 1}. name: ${result.name}`)
      console.log(`   _id: ${result._id}`)
      console.log(`   bedrooms: ${result.bedrooms}`)
      console.log(`   bathrooms: ${result.bathrooms}`)
      console.log(
        `   most recent review date: ${new Date(
          result.last_review
        ).toDateString()}`
      )
    })
  } else {
    console.log(
      `No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`
    )
  }
}

async function createMultipleListings(client, newListings) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertMany(newListings)

  console.log(
    `${result.insertedCount} new listings created with the following id(s):`
  )
  console.log(result.insertedIds)
}

async function createListing(client, newListing) {
  const result = await client
    .db('sample_airbnb')
    .collection('listingsAndReviews')
    .insertOne(newListing)

  console.log(`New listing created with the following id: ${result.insertedId}`)
}

async function listDatatbases(client) {
  databasesList = await client.db().admin().listDatabases()

  console.log('Databases:')
  databasesList.databases.forEach((db) => {
    console.log(`- ${db.name}`)
  })
}
