/* eslint-disable @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/strict-boolean-expressions */
import * as mysql from 'mysql2/promise'

const connection = mysql.createPool(process.env.DATABASE_URL)

export default connection
