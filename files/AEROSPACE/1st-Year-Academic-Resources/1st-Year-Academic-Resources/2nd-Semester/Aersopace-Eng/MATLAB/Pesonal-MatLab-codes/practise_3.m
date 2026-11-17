clear
clc
% defining the constants
r=2; l=5; h=[0:0.04:4];
v=(r^2.*acos(1-h/r)-(r-h).*sqrt(2*r.*h-h.^2)).*l;
plot(v,h)