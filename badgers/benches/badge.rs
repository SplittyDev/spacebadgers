use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("generate_badge", |b| {
        b.iter(|| {
            spacebadgers::BadgeBuilder::new()
                .label(black_box("build"))
                .status(black_box("passing"))
                .color(black_box("green"))
                .build()
                .svg()
        })
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
