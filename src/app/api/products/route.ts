import { db } from "@/db"

export const POST = async() => {
    const products = await db.query({
        topK: 22, //сколько мы хотим вернуть товаров
        vector: [0,0,0],
        includeMetadata: true
    })

    return new Response(JSON.stringify(products))
}