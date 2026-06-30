import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-29'})

const categories = await client.fetch<Array<{_id: string}>>(
  `*[_type == "portfolioCategory" && defined(phrase)]{_id}`
)

for (const category of categories) {
  await client.patch(category._id).unset(['phrase']).commit()
  console.log(`Removed obsolete phrase field from ${category._id}`)
}

console.log(`Done. Cleaned ${categories.length} portfolio category document(s).`)
