%v is a piecewise function
function piecewise
t=-50:50
for n=[1:length(t)]
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
plot(t,v)
end