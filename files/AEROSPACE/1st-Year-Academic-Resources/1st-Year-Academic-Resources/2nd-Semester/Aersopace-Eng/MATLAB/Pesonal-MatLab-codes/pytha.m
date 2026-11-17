% this function demonstrates how to there could be two or more functions in
% one function file.
function [c, error]=pytha(a,b)
c=sol(a,b);
fprintf('The hypotenus is %0.2f\n',c);
end
function hypo=sol(a,b)
hypo=sqrt(a^2+b^2);
end