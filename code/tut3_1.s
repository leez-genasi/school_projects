		AREA Prog2, CODE, READONLY  
		ENTRY  
	
		MOV r6, #10    		; load 10 into r6  
		MOV r4, r6  		; copy n into a temp register    
loop 	SUBS r4, r4, #1    	; decrement next multiplier  
		MULNE r6, r4, r6   	; perform multiply  
		BNE loop    		; go again if not complete  	
stop  	B stop  
		END