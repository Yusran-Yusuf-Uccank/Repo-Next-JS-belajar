import postgres from 'postgres';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
//import { sql } from '@vercel/postgres';

async function listInvoices() {
  try { 
    const data = await sql`
      SELECT invoices.amount, customers.name
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.amount = 666;
    `;
    return data; // Pastikan mengambil .rows agar data bersih
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
} 

export async function GET() {
  try {
    const invoices = await listInvoices();
    return Response.json(invoices);
  } catch (error: any) {
    // Ini akan menampilkan pesan error asli di browser
    return Response.json({ 
      message: 'Gagal mengambil data', 
      detail: error.message 
    }, { status: 500 });
  }
}
