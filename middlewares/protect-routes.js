function protectRoutes(req, res, next) {
  if(!res.locals.isAuth) {
    return res.redirect('/401');
  }

  const isAdminRoute = req.path.startsWith('/admin');
  if(isAdminRoute && !res.locals.isAdmin) {
    return res.redirect('/403');
  }

  next();
}



module.exports = protectRoutes;