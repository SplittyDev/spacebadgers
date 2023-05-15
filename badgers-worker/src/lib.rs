use worker::*;
use badgers::BadgeBuilder;

mod utils;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    utils::set_panic_hook();

    Router::new()
        .get("/badge/:subject/:status/:color", |mut req, ctx| {
            let subject = ctx.param("subject").unwrap();
            let status = ctx.param("status").unwrap();
            let color = ctx.param("color").cloned();

            let badge = BadgeBuilder::new()
                .label(subject.clone())
                .status(status.clone())
                .color_option(color)
                .build();

            Response::ok("")
        })
        .run(req, env)
        .await
}
