import { createContext, useState, useContext, useEffect } from "react";
import { useSocket } from "./SocketContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState("c");
    const [currentCode, setCurrentCode] = useState("");
    const [currentOutput, setCurrentOutput] = useState("");
    const {connected, socket} = useSocket();
    useEffect(() => {
        switch (currentLanguage) {
            case 'c':
                setCurrentCode(`
#include <stdio.h>
int main() {
    printf("Hello, World!");
    return 0;
}
                `);
                break;

            case 'javascript':
                setCurrentCode(`
console.log("Hello, World!");
                `);
                break;

            case 'python':
                setCurrentCode(`
if __name__ == "__main__":
    print("Hello, World!")
                `);
                break;

            case 'java':
                setCurrentCode(`
public class ${socket.id} {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
                `);
                break;

            case 'cpp':
                setCurrentCode(`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
                `);
                break;

            default:
                setCurrentCode("");
                break;
        }
    }, [currentLanguage]);

    return (
        <DataContext.Provider value={{
            currentLanguage,
            setCurrentLanguage,
            currentCode,
            setCurrentCode,
            currentOutput,
            setCurrentOutput
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
