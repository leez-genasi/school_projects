			AREA Lab_2, CODE, READONLY
			ENTRY

			; Main Routine: 
			LDR sp, =0x40001000
            ; INitialize a "Val_Table" in the readonly memory as DCD 0x12, 0x45, 0x09, 0x32, 0x21
			LDR r1, =Val_Table
			MOV r2, #5
			
            ; Passing adress of Val_Table and the number of elements by stack
			STMFD sp!, {r2}
			STMFD sp!, {r1}
			
			BL  findMax
			
            ; Received the highest results from the subroutine band load it into r0
			LDMFD sp!, {r0}
			ADD sp, sp, #4		; balance stack
stop		B stop

			; Sub Routine:	
			; Full-Descending Stack starting at 0x4000 1000
findMax		
			STMFD sp!, {r1-r4}
			LDR r1, [sp, #16]
			LDR r2, [sp, #20]
			
			LDR r3, [r1], #4	; r3 = max = first element
			SUBS r2, r2, #1		; decrement counter
			
            ; iterate through the numbers to find the maximum
loop		LDR r4, [r1], #4
			CMP r4, r3			; r4 - r3
			MOVGT r3, r4
			SUBS r2, r2, #1
			BNE loop

            ; Return the maximum value through the stack to the main routine
			STR r3, [sp, #16]
			LDMFD sp!, {r1 - r4}
			BX LR
			
		
Val_Table 	DCD 0x12, 0x45, 0x09, 0x32, 0x21
			END