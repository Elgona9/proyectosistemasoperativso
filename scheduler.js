// Show/hide quantum input based on algorithm selection
document.getElementById('algorithm').addEventListener('change', function() {
    const quantumGroup = document.getElementById('quantumGroup');
    if (this.value === 'rr') {
        quantumGroup.style.display = 'block';
    } else {
        quantumGroup.style.display = 'none';
    }
});

// Add a new process input
function addProcess() {
    const processInputs = document.getElementById('processInputs');
    const processCount = processInputs.children.length + 1;
    const newProcess = document.createElement('div');
    newProcess.className = 'process-input';
    newProcess.innerHTML = `
        <label>Proceso:</label>
        <input type="text" class="process-name" value="P${processCount}" placeholder="Nombre">
        <label>Tiempo de Llegada:</label>
        <input type="number" class="arrival-time" value="0" min="0">
        <label>Tiempo de Ráfaga:</label>
        <input type="number" class="burst-time" value="1" min="1">
        <button class="btn-remove" onclick="removeProcess(this)">Eliminar</button>
    `;
    processInputs.appendChild(newProcess);
}

// Remove a process input
function removeProcess(button) {
    const processInputs = document.getElementById('processInputs');
    if (processInputs.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('Debe haber al menos un proceso');
    }
}

// Get processes from input
function getProcesses() {
    const processInputs = document.querySelectorAll('.process-input');
    const processes = [];
    
    processInputs.forEach((input, index) => {
        const name = input.querySelector('.process-name').value || `P${index + 1}`;
        const arrivalTime = parseInt(input.querySelector('.arrival-time').value) || 0;
        const burstTime = parseInt(input.querySelector('.burst-time').value) || 1;
        
        processes.push({
            id: index,
            name: name,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            remainingTime: burstTime,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: -1,
            penalty: 0
        });
    });
    
    return processes;
}

// FCFS Algorithm
function fcfs(processes) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    const gantt = [];
    
    sortedProcesses.forEach(process => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }
        
        // Response time is when the process first gets CPU
        process.responseTime = currentTime - process.arrivalTime;
        
        gantt.push({
            process: process.name,
            start: currentTime,
            end: currentTime + process.burstTime
        });
        
        currentTime += process.burstTime;
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        process.penalty = process.turnaroundTime / process.burstTime;
    });
    
    return { processes: sortedProcesses, gantt };
}

// SJF Algorithm (Non-preemptive)
function sjf(processes) {
    const sortedProcesses = [...processes];
    const n = sortedProcesses.length;
    const completed = new Array(n).fill(false);
    let currentTime = 0;
    let completedCount = 0;
    const gantt = [];
    
    while (completedCount < n) {
        let minIndex = -1;
        let minBurst = Infinity;
        
        // Find process with shortest burst time that has arrived
        for (let i = 0; i < n; i++) {
            if (!completed[i] && sortedProcesses[i].arrivalTime <= currentTime) {
                if (sortedProcesses[i].burstTime < minBurst) {
                    minBurst = sortedProcesses[i].burstTime;
                    minIndex = i;
                }
            }
        }
        
        if (minIndex === -1) {
            // No process has arrived, move to next arrival
            currentTime = Math.min(...sortedProcesses
                .filter((p, i) => !completed[i])
                .map(p => p.arrivalTime));
        } else {
            const process = sortedProcesses[minIndex];
            
            process.responseTime = currentTime - process.arrivalTime;
            
            gantt.push({
                process: process.name,
                start: currentTime,
                end: currentTime + process.burstTime
            });
            
            currentTime += process.burstTime;
            process.completionTime = currentTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            process.penalty = process.turnaroundTime / process.burstTime;
            
            completed[minIndex] = true;
            completedCount++;
        }
    }
    
    return { processes: sortedProcesses, gantt };
}

// SRTF Algorithm (Preemptive SJF)
function srtf(processes) {
    const sortedProcesses = [...processes];
    const n = sortedProcesses.length;
    let currentTime = 0;
    let completedCount = 0;
    const gantt = [];
    
    // Find the maximum time needed
    const maxTime = Math.max(...sortedProcesses.map(p => p.arrivalTime + p.burstTime)) * 2;
    
    while (completedCount < n && currentTime < maxTime) {
        let minIndex = -1;
        let minRemaining = Infinity;
        
        // Find process with shortest remaining time that has arrived
        for (let i = 0; i < n; i++) {
            if (sortedProcesses[i].arrivalTime <= currentTime && 
                sortedProcesses[i].remainingTime > 0) {
                if (sortedProcesses[i].remainingTime < minRemaining) {
                    minRemaining = sortedProcesses[i].remainingTime;
                    minIndex = i;
                }
            }
        }
        
        if (minIndex === -1) {
            currentTime++;
        } else {
            const process = sortedProcesses[minIndex];
            
            // Set response time on first execution
            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }
            
            // Add to gantt chart (merge consecutive blocks of same process)
            if (gantt.length > 0 && gantt[gantt.length - 1].process === process.name) {
                gantt[gantt.length - 1].end = currentTime + 1;
            } else {
                gantt.push({
                    process: process.name,
                    start: currentTime,
                    end: currentTime + 1
                });
            }
            
            process.remainingTime--;
            currentTime++;
            
            if (process.remainingTime === 0) {
                process.completionTime = currentTime;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                process.waitingTime = process.turnaroundTime - process.burstTime;
                process.penalty = process.turnaroundTime / process.burstTime;
                completedCount++;
            }
        }
    }
    
    return { processes: sortedProcesses, gantt };
}

// Round Robin Algorithm
function roundRobin(processes, quantum) {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const n = sortedProcesses.length;
    const queue = [];
    let currentTime = 0;
    const gantt = [];
    const visited = new Array(n).fill(false);
    let completedCount = 0;
    
    // Add first arriving processes to queue
    for (let i = 0; i < n; i++) {
        if (sortedProcesses[i].arrivalTime <= currentTime) {
            queue.push(i);
            visited[i] = true;
        }
    }
    
    // If no process has arrived at time 0, jump to first arrival
    if (queue.length === 0) {
        currentTime = sortedProcesses[0].arrivalTime;
        queue.push(0);
        visited[0] = true;
    }
    
    while (queue.length > 0) {
        const index = queue.shift();
        const process = sortedProcesses[index];
        
        // Set response time on first execution
        if (process.responseTime === -1) {
            process.responseTime = currentTime - process.arrivalTime;
        }
        
        const executeTime = Math.min(quantum, process.remainingTime);
        
        gantt.push({
            process: process.name,
            start: currentTime,
            end: currentTime + executeTime
        });
        
        process.remainingTime -= executeTime;
        currentTime += executeTime;
        
        // Add newly arrived processes to queue
        for (let i = 0; i < n; i++) {
            if (!visited[i] && sortedProcesses[i].arrivalTime <= currentTime) {
                queue.push(i);
                visited[i] = true;
            }
        }
        
        if (process.remainingTime === 0) {
            process.completionTime = currentTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            process.penalty = process.turnaroundTime / process.burstTime;
            completedCount++;
        } else {
            queue.push(index);
        }
    }
    
    return { processes: sortedProcesses, gantt };
}

// Generate random color for each process
function getProcessColor(processName) {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B195', '#C06C84', '#6C5B7B', '#355C7D'
    ];
    
    // Use process name to deterministically select a color
    let hash = 0;
    for (let i = 0; i < processName.length; i++) {
        hash = processName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Display Gantt chart
function displayGantt(gantt) {
    const ganttChart = document.getElementById('ganttChart');
    ganttChart.innerHTML = '';
    
    gantt.forEach((block, index) => {
        const ganttBlock = document.createElement('div');
        ganttBlock.className = 'gantt-block';
        ganttBlock.style.backgroundColor = getProcessColor(block.process);
        ganttBlock.style.width = `${(block.end - block.start) * 50}px`;
        
        ganttBlock.innerHTML = `
            <span class="process-label">${block.process}</span>
            <span class="time-label">${block.start}</span>
            ${index === gantt.length - 1 ? `<span class="time-label-end">${block.end}</span>` : ''}
        `;
        
        ganttChart.appendChild(ganttBlock);
        
        // Add end time label for last block or if next block starts later
        if (index < gantt.length - 1 && gantt[index + 1].start > block.end) {
            ganttBlock.innerHTML += `<span class="time-label-end">${block.end}</span>`;
        }
    });
}

// Display results table
function displayResults(processes) {
    const tbody = document.getElementById('resultsBody');
    const tfoot = document.getElementById('resultsFooter');
    tbody.innerHTML = '';
    
    let totalTurnaround = 0;
    let totalWaiting = 0;
    let totalResponse = 0;
    let totalPenalty = 0;
    
    processes.forEach(process => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${process.name}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.completionTime}</td>
            <td>${process.turnaroundTime}</td>
            <td>${process.waitingTime}</td>
            <td>${process.responseTime}</td>
            <td>${process.penalty.toFixed(2)}</td>
        `;
        
        totalTurnaround += process.turnaroundTime;
        totalWaiting += process.waitingTime;
        totalResponse += process.responseTime;
        totalPenalty += process.penalty;
    });
    
    const n = processes.length;
    tfoot.innerHTML = `
        <tr>
            <td colspan="4">Promedios</td>
            <td>${(totalTurnaround / n).toFixed(2)}</td>
            <td>${(totalWaiting / n).toFixed(2)}</td>
            <td>${(totalResponse / n).toFixed(2)}</td>
            <td>${(totalPenalty / n).toFixed(2)}</td>
        </tr>
    `;
}

// Main calculation function
function calculate() {
    const algorithm = document.getElementById('algorithm').value;
    const processes = getProcesses();
    
    if (processes.length === 0) {
        alert('Agregue al menos un proceso');
        return;
    }
    
    let result;
    
    switch (algorithm) {
        case 'fcfs':
            result = fcfs(processes);
            break;
        case 'sjf':
            result = sjf(processes);
            break;
        case 'srtf':
            result = srtf(processes);
            break;
        case 'rr':
            const quantum = parseInt(document.getElementById('quantum').value) || 2;
            if (quantum < 1) {
                alert('El quantum debe ser mayor o igual a 1');
                return;
            }
            result = roundRobin(processes, quantum);
            break;
        default:
            alert('Seleccione un algoritmo válido');
            return;
    }
    
    displayGantt(result.gantt);
    displayResults(result.processes);
    
    document.getElementById('results').style.display = 'block';
}
