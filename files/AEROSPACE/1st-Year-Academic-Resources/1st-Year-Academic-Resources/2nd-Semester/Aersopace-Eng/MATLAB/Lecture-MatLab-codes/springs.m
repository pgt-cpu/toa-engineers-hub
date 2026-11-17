function [k,u]=springs(f,e)
format short
k=f/e;
u=0.5.*k.*e.^2;
x=max(u);
fprintf('The maximum potential energy is %f.\n',x)

end