#include<reg51.h>
//declaration of connections
sbit led_red= P1^0;
sbit led_yellow= P1^1;
sbit led_green= P1^2;

	
void main()
{
	unsigned int i;
	led_red = led_yellow=led_green=0;

	while(1)
	{
			
		led_red = 1;
		for (i=0;i<50000;i++);
		//for (i=0;i<60000;i++);
			led_red=0;
			
		
		// yellow led
		led_yellow = 1;
				for (i=0;i<30000;i++);
			led_yellow=0;
			
		
		//green led
		led_green = 1;
		for (i=0;i<50000;i++);
	//	for (i=0;i<60000;i++);
		
			led_green=0;
			
			
	}
	
	
}