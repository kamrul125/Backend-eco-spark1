-- AlterTable
ALTER TABLE "ideas" ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "image" TEXT DEFAULT 'https://images.unsplash.com/photo-1497215728101-856f4ea42174';
