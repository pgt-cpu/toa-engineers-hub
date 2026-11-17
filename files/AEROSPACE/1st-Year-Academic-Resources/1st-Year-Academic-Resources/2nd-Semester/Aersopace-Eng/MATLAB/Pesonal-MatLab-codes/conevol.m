% cone
function [cone]=conevol(r,h)
cone=(1/3)*pi*(r^2)*h;
fprintf('The volume of the solid figure is %.2f\n\n',cone)
end