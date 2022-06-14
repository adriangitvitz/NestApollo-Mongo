export default () => ({
	jwtsecret: process.env.SECRET,
	jwtexp: process.env.JWT_EXP,
	mongodburi: process.env.MONGODB_URL,
	refreshid: process.env.REFRESH_ID,
	refreshiv: process.env.REFRESH_IV
});
