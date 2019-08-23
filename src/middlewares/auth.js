
export default (req, reply, next) => {
    if (req.header('Authorization') !== `Bearer ${process.env.AUTH_KEY}`) {
        return reply.status(403).send({ msg: 'UNAUTHORIZED' });
    }
    return next();
}
