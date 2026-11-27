Ts=0.0001;
t=0:.00001:20*Ts;
sig=sin(2000*pi*t)+cos(2000*pi*t);
maxsig=max(sig); %signal max
interv=2*maxsig/(2^3-1); %interval length for 8 levels resolution
u=maxsig+interv;
partition = [-maxsig:interv:maxsig]; 
codebook = [-maxsig:interv:u]; 
[partition2,codebook2]=lloyds(sig,codebook);
[index,quants,distor] = quantiz(sig,partition,codebook); % Quantize.
[index2,quant2,distor2] = quantiz(sig,partition2,codebook2); 
plot(t,sig,'-',t,quants,'-');
legend('Original signal','Quantized signal');
plot(t,sig,'r-',t,quant2,'b-');
legend('Original signal','Optimized signal');
[distor,distor2]