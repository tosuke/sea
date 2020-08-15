import Router from "@koa/router"
import { WebRouterState, WebRouterCustom } from ".."
import { getRepository, Like, Not, MoreThan } from "typeorm"
import { Post } from "../../../db/entities/post"

const router = new Router<WebRouterState, WebRouterCustom>()

router.get("/", async ctx => {
    ctx.render("explore/ranking/index")
})

router.get("/zyan_text", async ctx => {
    const data = await getRepository(Post)
        .createQueryBuilder()
        .select(["COUNT(*) as count", "text"])
        .where({ text: Like("%じゃん") })
        .groupBy("text")
        .having("COUNT(text) > 1")
        .orderBy("count", "DESC")
        .getRawMany()
    ctx.render("explore/ranking/zyan_text", { data })
})

router.get("/same_text", async ctx => {
    const days90 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
    const data = await getRepository(Post)
        .createQueryBuilder()
        .select(["COUNT(*) as count", "text"])
        .where({ text: Not(""), createdAt: MoreThan(days90) })
        .groupBy("text")
        .having("COUNT(text) > 1")
        .orderBy("count", "DESC")
        .getRawMany()
    ctx.render("explore/ranking/same_text", { data })
})

router.get("/kitaa", async ctx => {
    const data = await getRepository(Post)
        .createQueryBuilder()
        .select(["CHAR_LENGTH(SUBSTRING(text FROM 'きたあ+')) as charcnt", "COUNT(*) as cnt"])
        .andWhere("SUBSTRING(text FROM 'きたあ+') IS NOT NULL")
        .groupBy("charcnt")
        .orderBy("cnt", "DESC")
        .addOrderBy("charcnt", "DESC")
        .getRawMany()
    ctx.render("explore/ranking/kitaa", { data })
})

export default router
