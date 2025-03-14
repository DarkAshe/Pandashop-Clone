const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    products: async ({ filter }) => {
        const where = {};
    
        if (filter?.discountedOnly) {
            where.discountPrice = { lt: prisma.product.fields.originalPrice };
        }
    
        if (filter?.categoryId) {
            where.categoryId = Number(filter.categoryId);
        }
    
        return await prisma.product.findMany({
            where,
            include: { category: true, attributes: true },
        });
    },
    
    
    product: async ({ id }) => {
        return await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { category: true, attributes: true }
        });
    },

    createProduct: async ({ name, image, originalPrice, discountPrice, categoryId, attributes }) => {
        return await prisma.product.create({
            data: {
                name,
                image,
                originalPrice,
                discountPrice,
                category: { connect: { id: Number(categoryId) } },
                attributes: {
                    create: attributes.map(attr => ({ key: attr.key, value: attr.value })),
                },
            },
            include: { category: true, attributes: true },
        });
    },

    updateProduct: async ({ id, name, image, originalPrice, discountPrice, categoryId, attributes }) => {
        return await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                image,
                originalPrice,
                discountPrice,
                category: categoryId ? { connect: { id: Number(categoryId) } } : undefined,
                attributes: attributes
                    ? {
                        deleteMany: {},
                        create: attributes.map(attr => ({ key: attr.key, value: attr.value })),
                    }
                    : undefined,
            },
            include: { category: true, attributes: true },
        });
    },

    deleteProduct: async ({ id }) => {
        try {
            const product = await prisma.product.findUnique({ where: { id: Number(id) } });
            if (!product) {
                throw new Error("Product not found.");
            }

            await prisma.productAttribute.deleteMany({ where: { productId: Number(id) } });

            return await prisma.product.delete({ where: { id: Number(id) } });
        } catch (error) {
            throw new Error("Error deleting product: " + error.message);
        }
    }
};
