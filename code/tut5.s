		AREA tut5, CODE, READONLY
		ENTRY
		
		; q1
		;MOV r7, #0x8C, 4
		;MOV r7, #0x42, 30
		;MVN r7, #2
		;MVN r7, #0x8C, 4
		
		; q2
		;MOV r2, #0xA4, #24		; 0xA400
		;LDR r2, =0x7D8	 		; 0x7D8
		;MOV r2, #0x5D, #22		; 0x17400
		;MOV r2, #0x66, #26		;0x1980
		
		
		MOV r4, #1
		; q3a
		RSB r0, r4, r4, LSL #3	; r0 = r4*2^3 - r4
		ADD r0, r0, r4, LSL #7
		
		
		;q3b
		RSB r0, r4, r4, LSL #8	; r0 = r4*2^8-r4
		
		;q3c
		MOV r0, r4, LSL #4		; r0 = r4 * 2^4
		ADD r0, r0, r4, LSL #1	; r0 = r0 + r4*2^1
		
		;q3d
		MOV r0, r4, LSL #14		; r0 = r4 * 2^14
		
		; q4
;index	MOV r0, #10				; i counter
;		MOV r10, #1
;loop	
;		ADD r10, r10, #1 		; increase by 1



;		SUBS r0, r0, #1			; i++
		
;		BNE loop
				
stop 	B stop
		END