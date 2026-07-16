-- CreateTable
CREATE TABLE "PostStat" (
    "slug" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PostStat_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "email" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("email")
);
