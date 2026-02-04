import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Example: Add an Authorization header if a token exists
  // const token = localStorage.getItem('token');
  
  // Clone the request and set the new header
  const authReq = req.clone({
    // setHeaders: {
    //   Authorization: `Bearer ${token}`
    // }
  });

  // Pass on the cloned request instead of the original request.
  // We are passing 'req' for now since authReq is just a placeholder example
  console.log(`Request to: ${req.url}`);
  
  return next(req);
};
