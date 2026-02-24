import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not defined')

const districts = ['매교동', '세류동', '인계동', '교동', '행궁동']
const propertyTypes = ['아파트', '원룸', '투룸', '오피스텔', '상가']
const transactionTypes = ['매매', '전세', '월세']

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('Seeding process started (Raw SQL via pg Pool)...')
  const pool = new Pool({ connectionString })

  try {
    // Clear data
    console.log('Clearing existing data...')
    await pool.query('DELETE FROM inquiries')
    await pool.query('DELETE FROM properties')

    console.log('Starting insertion of 50 properties...')
    for (let i = 1; i <= 50; i++) {
      const propertyType = getRandomElement(propertyTypes)
      const district = getRandomElement(districts)
      const transactionType = getRandomElement(transactionTypes)
      const isRent = transactionType === '월세'
      const deposit = isRent ? getRandomInt(500, 3000) : getRandomInt(10000, 50000)
      const rent = isRent ? getRandomInt(30, 150) : null
      const sale_price = transactionType === '매매' ? getRandomInt(30000, 150000) : null
      const area = parseFloat((getRandomInt(20, 150) + Math.random()).toFixed(2))
      const floor = `${getRandomInt(1, 15)}층`
      const total_floor = `${getRandomInt(5, 20)}층`
      const slug = `property-${i}-${Date.now()}`

      const options = JSON.stringify({
        air_conditioner: Math.random() > 0.5,
        washing_machine: Math.random() > 0.5,
        refrigerator: Math.random() > 0.5,
      })

      const images = JSON.stringify([
        `https://picsum.photos/seed/${i * 10 + 1}/800/600`,
        `https://picsum.photos/seed/${i * 10 + 2}/800/600`,
        `https://picsum.photos/seed/${i * 10 + 3}/800/600`,
      ])

      const query = `
            INSERT INTO properties (
                id, title, slug, district, property_type, transaction_type, 
                deposit, rent, sale_price, area, floor, total_floor, 
                maintenance_fee, options, elevator, parking, lat, lng, 
                thumbnail, images, is_featured, is_shared, status, 
                view_count, created_at, updated_at
            ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, 
                $6, $7, $8, $9, $10, $11, 
                $12, $13, $14, $15, $16, $17, 
                $18, $19, $20, $21, $22, 
                $23, NOW(), NOW()
            )
        `
      const values = [
        `[${transactionType}] ${district} ${propertyType} 특급 매물 ${i}`,
        slug, district, propertyType, transactionType,
        deposit, rent, sale_price, area, floor, total_floor,
        getRandomInt(5, 30), options, Math.random() > 0.5, Math.random() > 0.5,
        37.266 + (Math.random() - 0.5) * 0.01, 127.016 + (Math.random() - 0.5) * 0.01,
        `https://picsum.photos/seed/${i * 10}/800/600`, images,
        i <= 6, Math.random() > 0.7, Math.random() > 0.9 ? 'sold' : 'active',
        getRandomInt(0, 1000)
      ]

      await pool.query(query, values)
      if (i % 10 === 0) console.log(`Inserted ${i} properties...`)
    }
    console.log('Seeding finished successfully!')
  } catch (err) {
    console.error('Seeding error:', err)
  } finally {
    await pool.end()
  }
}

main()
