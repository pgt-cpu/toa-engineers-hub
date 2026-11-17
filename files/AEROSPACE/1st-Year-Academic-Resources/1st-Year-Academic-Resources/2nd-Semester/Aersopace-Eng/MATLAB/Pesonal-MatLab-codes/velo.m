g=9.81; m=68.1; cd=0.25;
function v= velocity(t)
v= sqrt((g*m)/cd)*tanh(sqrt((g*cd)/m)*t);
plot(v,t)
end