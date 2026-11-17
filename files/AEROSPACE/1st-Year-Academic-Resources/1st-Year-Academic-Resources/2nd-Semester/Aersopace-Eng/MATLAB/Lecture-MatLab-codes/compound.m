% Write a matlab code that calculates the compound interest accured on GHc
% 100.00 after a period of 5 years at a rate of 5% per annum interest.
% Function file
function F=compound(p,i,n)
F=p*(1+i).^n
end