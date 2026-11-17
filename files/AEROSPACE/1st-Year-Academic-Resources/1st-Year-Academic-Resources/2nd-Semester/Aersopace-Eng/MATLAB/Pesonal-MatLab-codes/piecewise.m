% piecewise function assignment 
function piecewise
t=-50:50;
for n=1:length(t)
    if t(n) >= 0 && t(n) <= 8
       v(n)=10*t(n)^2-5*t(n);
    end
    if t(n) >= 8 && t(n) <= 16
       v(n)=624-5*t(n);
    end
    if t(n) >= 8 && t(n) <= 16
       v(n)=36*t(n) + 12*(t(n)-16)^2;
    end
    if t(n) >= 26
       v(n)=2136*exp(-0.1*(t(n)-26));
    end
    if t(n) < 0
       v(n)=0;
    end
end
% plot a graph of the rocket's velocity,v against time,t
plot(t,v);
xlabel('time,s')
ylabel('velocity,m/s')
title('A plot of the velocity,v of a rocket against time,t')
end