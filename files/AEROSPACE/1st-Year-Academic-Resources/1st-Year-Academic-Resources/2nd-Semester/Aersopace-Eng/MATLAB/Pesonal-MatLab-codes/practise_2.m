clear
clc
% script file for bungee jumper
g=9.81; m=68.1; cd=0.25; t=[0:2:20];
v=sqrt(g*m/m)*tanh(sqrt(g*cd/m).*t);
% display of values
disp('    time    Velocity')
disp([t',v'])
