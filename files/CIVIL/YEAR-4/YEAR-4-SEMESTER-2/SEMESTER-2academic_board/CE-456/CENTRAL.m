clc
t = CDM(:,1);
P_t = CDM(:,2);
x_t = CDM(:,3);
v_t = CDM(:,4);
a_t = CDM(:,5);
%plot(t, P_t, 'k*-');
%hold on
plot(t, x_t, 'bo-');
hold on
plot(t, v_t, 'ms-');
hold on
plot(t, a_t, 'rd-');
hold off
