export default () => ({
	jwtsecret: process.env.SECRET,
	jwtexp: process.env.JWT_EXP,
	mongodburi: process.env.MONGODB_URL
});
