%Biomaterials assignment 2
%Andam Benedict Kingsford 5959416
 
    
 
              %Question 1
 %for infection:
 f_i=0.05*exp(-t);
 %probability of failure after 15 years.   
 %f_i=1.529*10^(-8).
 %probability of failure after 30 years is 4.679*10^(-15).
 
 %for loosening:
 f_lo=0.01*exp(0.15*t);
 %probabilty of failure after 15 years is 0.0949.
 %probability of failure after 30 years is 0.9.
 
 
 %for fracture:
 f_fr=0.01*exp(0.01*t);
 %probability of failure after 15 years is 0.0116.
 %probability of failure after 30 years is 0.0135.
 
 %for wear:
 f_w=0.01*exp(0.1*t);
 %probability of failure after 15 years is 0.0448.
 %probability of failure after 30 years is 0.2009.
 
 %for surgical error:
 f_su=0.001;
 %probability of failure after 15 years is 0.001.
 %probability of failure after 30 years is 0.001.
 
 %for pain:
 f_pa=0.005;
 %probability of failure after 15 years is 0.005.
 %probability of failure after 30 years is 0.005.
 
 
 %Question 2
 %Which factor is the most important for the longevity of the
 %arthrosplasty and why?
 
 %Loosening is the most important factor for the longevity of the
 %arthroplasty because it has a the highest probability of failure for the
 %specified periods of time. It means the arthroplasty is likely to fail by
 %loosening than all the rest of the other factors. The second most
 %important factor could be wear since it has the second highest
 %probability of failure after 30 years.
 
 
 %Question 2
 %Plotting the graph
 t=[0:1:30];
 f_i=0.05*exp(-t);
 f_lo=0.01*exp(0.15*t);
 f_fr=0.01*exp(0.01*t);
 f_w=0.01*exp(0.1*t);
 f_su=0.001;
 f_pa=0.005;
 %let r be the reliability of the implant
 %r=1-f
 r=(1-f_i*1-f_lo*1-f_fr*1-f_w*1-f_su*1-f_pa);
 
 plot(t,f_i,':.',t,f_lo,'-.',t,f_fr,'--',t,f_w,'-',t,f_su,'-.',t,f_pa,':.')
 hold on
 %plot(t,1-f_i,':.',t,1-f_lo,'-.',t,1-f_fr,'--',t,1-f_w,'-',t,1-f_su,'-.',t,1-f_pa,':.')
 
 legend('infection','loosening','fracture','wear','surgical error','pain');
 plot(t,r)
 text(5,1,'total success(reliability)');
 
 grid on
 xlabel('time(from day of implant)/implant period');
 ylabel('probability of failureof implant');
 title('Graph of probability of failure of implant versus time');
 
 
 
 
 
 
 
 