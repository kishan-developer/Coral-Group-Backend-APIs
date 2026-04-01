const InventorySchema = new Schema({
  hotelId: Schema.Types.ObjectId,
  roomTypeId: Schema.Types.ObjectId,
  date: Date,
  inventory: Number,
  stopSell: Boolean
});