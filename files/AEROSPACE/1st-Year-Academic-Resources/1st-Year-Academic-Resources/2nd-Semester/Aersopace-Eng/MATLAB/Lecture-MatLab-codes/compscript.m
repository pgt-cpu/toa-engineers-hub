% script file
clear
clc
p=100;
i=0.05;
n=5;
fprintf('%4s %12s\n','n','F')
for j=1:n;
    F=compound(p,i,n);
    fprintf('%4d %12.2\n',j,F)
end