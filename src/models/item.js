// models/item.js
import {model, models, Schema} from "mongoose";

const itemSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true, },
    name: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const Item = models.Item || model('Item', itemSchema);
Item.schema.set('collection', 'items');

export default Item;
