function find_dy(a1,a2,a3,a4)
q=a1*3;
w=a2*2;
e=a3*1;
r=a4*0;
fprintf('dy/dx = %dX^2 + %dX + %d + %d\n',q,w,e,r)
% ploting the gradient of that equation
x=[-10:10]; y=q*(x.^2)+w*x+e;
plot(x,y)
hold on
x1=[-10:10]; y1=a1*(x1.^3)+a2*(x1.^2)+a3*x1+a4;
plot(x1,y1)
hold off
legend('cubic function','gradient of function')
title('Differential graph')
[c1, c2]=quadratic(q,w,e)
end