import jwt from 'jsonwebtoken'

const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (authorization) {
    const token = authorization.slice(7, authorization.length)
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Le jeton n'est pas valide" })
      }
      req.user = decode
      return next()
    })
  } else {
    return res
      .status(401)
      .send({ message: "vous n'avez pas fourni le jeton d'authentification" })
  }
}

export { signToken, isAuth }
