import * as coda from "@codahq/packs-sdk";

/*
 * Schemas for your formulas and sync tables go here, for example:
 */

export const SizeSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  id: "id",
  primary: "summary",
  properties: {
    id: { type: coda.ValueType.Number },
    name: { type: coda.ValueType.String },
    price: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Currency },
    summary: { type: coda.ValueType.String }
  },
});

export const ItemSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  id: "name",
  primary: "name",
  properties: {
    name: { type: coda.ValueType.String },
    photo: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
    sizes: { type: coda.ValueType.Array, items: SizeSchema },
  },
});
