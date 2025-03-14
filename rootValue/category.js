const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    categories: async () => {
        return await prisma.category.findMany();
    },

    category: async ({ id }) => {
        const category = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!category) {
            throw new Error("Category not found.");
        }
        return category;
    },

    createCategory: async ({ name, image }) => {
        if (!name || !image) {
            throw new Error("All fields are required");
        }

        return await prisma.category.create({ data: { name, image } });
    },

    updateCategory: async ({ id, name, image }) => {
        try {
            const category = await prisma.category.findUnique({ where: { id: Number(id) } });

            if (!category) {
                throw new Error("Category not found.");
            }

            return await prisma.category.update({
                where: { id: Number(id) },
                data: { name: name || category.name, image: image || category.image }
            });
        } catch (error) {
            throw new Error("Error updating category: " + error.message);
        }
    },

    deleteCategory: async ({ id }) => {
        try {
            const category = await prisma.category.findUnique({ where: { id: Number(id) } });
            if (!category) {
                throw new Error("Category not found.");
            }

            const products = await prisma.product.findMany({ where: { categoryId: Number(id) } });

            for (const product of products) {
                await prisma.productAttribute.deleteMany({ where: { productId: product.id } });
                await prisma.product.delete({ where: { id: product.id } });
            }

            await prisma.category.delete({ where: { id: Number(id) } });

            return category;
        } catch (error) {
            throw new Error("Error deleting category: " + error.message);
        }
    }

};
