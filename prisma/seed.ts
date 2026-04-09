import { PrismaClient } from "@prisma/client";
import { sampleCandles, sampleSymbols } from "../lib/sampleData";
import { strategyTemplates } from "../core/strategies/engine";

const prisma = new PrismaClient();

async function main() {
  for (const s of sampleSymbols) {
    const symbol = await prisma.symbol.upsert({
      where: { ticker: s.ticker },
      update: { name: s.name, exchange: s.exchange, sector: s.sector, industry: s.industry },
      create: { ticker: s.ticker, name: s.name, exchange: s.exchange, sector: s.sector, industry: s.industry }
    });

    const candles = sampleCandles[s.ticker].slice(-120);
    for (const c of candles) {
      await prisma.candle.create({
        data: {
          symbolId: symbol.id,
          timestamp: new Date(c.timestamp),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume
        }
      });
    }
  }

  for (const st of strategyTemplates) {
    await prisma.strategy.create({
      data: {
        name: st.name,
        description: `${st.name} template`,
        configJson: st,
        isTemplate: true
      }
    });
  }
}

main().finally(async () => prisma.$disconnect());
