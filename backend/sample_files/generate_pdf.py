import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def build_lecture_pdf():
    os.makedirs("backend/sample_files", exist_ok=True)
    pdf_path = "backend/sample_files/Operating_Systems_Virtual_Memory.pdf"
    
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    slides = [
        (
            "Slide 1: Operating Systems — Lecture 14",
            "Virtual Memory & Paging Architectures",
            [
                "Course: CS 301 - Operating Systems Principles",
                "Instructor: Dept. of Computer Science & Systems",
                "Core Focus: Memory virtualization, page tables, and demand paging",
                "Objective: Eliminate external fragmentation and isolate process address spaces"
            ]
        ),
        (
            "Slide 2: Motivation for Virtual Memory",
            "Physical Memory Limitations & Logical Address Spaces",
            [
                "Physical RAM is finite and shared among concurrent processes.",
                "Process address spaces must remain protected and isolated from one another.",
                "Paging separates logical memory from physical frames, enabling non-contiguous allocation.",
                "Only portions of a binary need to reside in physical RAM for execution (Demand Paging)."
            ]
        ),
        (
            "Slide 3: Paging Mechanics & Address Translation",
            "Virtual Page Numbers and Page Offsets",
            [
                "Physical memory is partitioned into fixed-size blocks termed Frames.",
                "Logical memory is partitioned into identical-sized blocks termed Pages.",
                "Frame size == Page size (typically 4 KB = 4096 bytes = 2^12 bytes, requiring 12 offset bits).",
                "Virtual address format: (Page Number [p], Page Offset [d]).",
                "A per-process Page Table translates logical page numbers into physical frame numbers."
            ]
        ),
        (
            "Slide 4: Translation Lookaside Buffer (TLB)",
            "Hardware Acceleration for Fast Memory Access",
            [
                "Naive paging doubles physical memory accesses: 1 for page table + 1 for actual data.",
                "The TLB is an associative, high-speed on-chip hardware cache.",
                "TLB Hit: Frame resolved in ~1 CPU clock cycle.",
                "TLB Miss: Requires accessing page table in main memory, then updating the TLB.",
                "Effective Access Time (EAT) = Hit_Ratio*(TLB+Mem) + (1-Hit_Ratio)*(TLB+2*Mem)."
            ]
        ),
        (
            "Slide 5: Demand Paging & Page Fault Traps",
            "Handling Non-Resident Memory",
            [
                "Page Table Entry (PTE) includes a valid-invalid bit (1 = in RAM, 0 = on disk).",
                "Accessing a page with valid bit = 0 triggers a CPU hardware Page Fault trap.",
                "The OS kernel handles the trap: finds a free frame, reads block from backing store into RAM.",
                "The OS updates the PTE to valid=1 and restarts the interrupted instruction.",
                "Page fault service latency is dominated by disk I/O (~milliseconds vs nanoseconds)."
            ]
        ),
        (
            "Slide 6: Page Replacement Policies",
            "Evicting Victim Frames Under Memory Saturation",
            [
                "When physical RAM has no free frames, a page replacement algorithm selects a victim frame.",
                "FIFO (First-In, First-Out): Simple queue. Susceptible to Belady's Anomaly.",
                "Belady's Anomaly: Adding more physical frames can counter-intuitively increase page faults.",
                "LRU (Least Recently Used): Replaces page unused for the longest time (Stack Algorithm).",
                "Optimal (OPT / MIN): Replaces page that will not be used for longest future duration."
            ]
        ),
        (
            "Slide 7: Thrashing and The Working-Set Model",
            "System Performance Collapse Prevention",
            [
                "Thrashing occurs when processes spend more time paging than executing instructions.",
                "When active working sets exceed physical memory, page faults cascade and CPU utilization drops to ~0%.",
                "The Working-Set Window Delta defines the set of pages referenced in recent delta time.",
                "If sum of working sets > total frames, OS long-term scheduler must suspend/swap out processes."
            ]
        )
    ]
    
    for slide_title, subtitle, bullets in slides:
        # Header banner
        c.setFillColorRGB(0.12, 0.16, 0.25)
        c.rect(0, height - 80, width, 80, fill=1, stroke=0)
        
        c.setFillColorRGB(1, 1, 1)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(40, height - 40, slide_title)
        
        c.setFont("Helvetica", 12)
        c.drawString(40, height - 62, subtitle)
        
        # Slide content
        c.setFillColorRGB(0.1, 0.1, 0.1)
        c.setFont("Helvetica", 13)
        y = height - 130
        for b in bullets:
            c.circle(50, y + 4, 3, fill=1, stroke=0)
            c.drawString(65, y, b)
            y -= 38
            
        # Footer
        c.setFillColorRGB(0.5, 0.5, 0.5)
        c.setFont("Helvetica", 10)
        c.drawString(40, 30, "KURIO Sample Lecture Document • Computer Science 301")
        c.drawRightString(width - 40, 30, f"Page {c.getPageNumber()}")
        
        c.showPage()
        
    c.save()
    print(f"Successfully generated sample lecture PDF: {pdf_path}")

if __name__ == "__main__":
    build_lecture_pdf()
