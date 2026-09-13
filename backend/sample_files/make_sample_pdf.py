import os
from pypdf import PdfWriter

# Let's generate a minimal valid multi-page PDF with lecture content
def create_sample_lecture_pdf():
    os.makedirs("backend/sample_files", exist_ok=True)
    out_path = "backend/sample_files/Operating_Systems_Virtual_Memory.pdf"
    
    writer = PdfWriter()
    
    slides_text = [
        "Operating Systems: Lecture 14\nVirtual Memory & Paging Architectures\nDepartment of Computer Science\nInstructor: Operating Systems Group",
        "Slide 2: Motivation for Virtual Memory\n- Physical memory is finite\n- Need process memory protection\n- Allows non-contiguous allocation\n- Only part of program needs to be in memory for execution",
        "Slide 3: Paging Architecture\n- Divide physical memory into fixed-sized blocks: Frames\n- Divide logical address space into same-sized blocks: Pages\n- Frame size == Page size (typically 4 KB = 2^12 bytes)\n- Virtual address format: (Page Number [p], Page Offset [d])",
        "Slide 4: Translation Lookaside Buffer (TLB)\n- Associative hardware cache for page table entries\n- TLB hit retrieves frame in 1 cycle\n- TLB miss forces access to page table in physical memory\n- Effective Access Time (EAT) = Hit_Ratio*(TLB+Mem) + (1-Hit_Ratio)*(TLB+2*Mem)",
        "Slide 5: Demand Paging & Page Fault Handling\n- Valid-invalid bit in Page Table Entry\n- If bit is 0, reference triggers a page fault exception\n- OS trap handler locates frame on disk, swaps into physical RAM, restarts instruction",
        "Slide 6: Page Replacement Algorithms\n- FIFO: First-In First-Out. May exhibit Belady's Anomaly where more frames yield more page faults\n- LRU: Least Recently Used. Stack algorithm; optimal practical performance\n- Optimal (OPT/MIN): Theoretical lower bound",
        "Slide 7: Thrashing and The Working-Set Model\n- Thrashing occurs when processes spend more time paging than executing\n- CPU utilization plummets to near 0%\n- Solution: Working-set strategy; OS suspends processes when memory demand exceeds physical frames"
    ]
    
    for text in slides_text:
        # Create a blank page
        page = writer.add_blank_page(width=612, height=792)
        # Note: In standard pypdf, adding text directly requires annotations or streams, 
        # or reportlab. Let's see if reportlab is needed or if simple canvas or text works.
    
    with open(out_path, "wb") as f:
        writer.write(f)
    print(f"Created blank template at {out_path}")

if __name__ == "__main__":
    create_sample_lecture_pdf()
