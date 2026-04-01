const MappingSchema = new Schema({
  hotelId: Schema.Types.ObjectId,
  channel: String,
  otaRoomId: String,
  hotelRoomId: Schema.Types.ObjectId,
  otaRatePlanId: String,
  hotelRatePlanId: Schema.Types.ObjectId,
  active: { type: Boolean, default: true }
});