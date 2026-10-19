		AREA lab1, CODE
		ENTRY
			
		; Initialize a table of 20 consecutive, starting from 1, using DCD in read-only memory.
		; Computes the addition of only even numbers in a count-up loop in R6
		ADR r0, table
		LDR r3, [r0], #4	; increment add by 1 so loop starts at #2
		MOV r1, #0			; counter
		MOV r6, #0

loop	LDR r3, [r0], #8	; post-index
		ADD r6, r6, r3		; r6=r6+r3
		ADD r1, r1, #1		; i++
		CMP r1, #10
		BLT loop
		
		; Multiply the number in R6 with 0xFFFF 1234 and store the result in R8
		MOV r2, #0xFFFFFFFF	; load -1
		MOV r7, r6, LSL #15
		ADD r7, r7, r6, LSL #14
		ADD r7, r7, r6, LSL #13
		ADD r7, r7, r6, LSL #11
		ADD r7, r7, r6, LSL #10
		ADD r7, r7, r6, LSL #8
		ADD r7, r7, r6, LSL #7
		ADD r7, r7, r6, LSL #6
		ADD r7, r7, r6, LSL #3
		ADD r7, r7, r6, LSL #2
		MUL r8, r7, r2		; r8=r8*r2
		
stop 	B stop
table 	DCD 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
		END