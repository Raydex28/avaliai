"use client"

import { useState, useEffect } from "react"

type DeviceType = "mobile" | "desktop"

// Criando um contexto simples para gerenciar o tipo de dispositivo
const createDeviceTypeStore = () => {
  let deviceType: DeviceType = "desktop"
  const listeners = new Set<() => void>()

  return {
    getDeviceType: () => deviceType,
    setDeviceType: (type: DeviceType) => {
      deviceType = type
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

// Singleton store
const deviceTypeStore = createDeviceTypeStore()

export function useDeviceType(): {
  deviceType: DeviceType
  isMobile: boolean
  isDesktop: boolean
  setDeviceType: (type: DeviceType) => void
} {
  const [deviceType, setLocalDeviceType] = useState<DeviceType>(deviceTypeStore.getDeviceType())

  useEffect(() => {
    // Função para verificar o tipo de dispositivo
    const checkDeviceType = () => {
      // Verificar primeiro pelo User-Agent para detecção mais precisa
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

      // Se o User-Agent indica um dispositivo móvel
      if (mobileRegex.test(userAgent)) {
        deviceTypeStore.setDeviceType("mobile")
        return
      }

      // Verificação secundária baseada no tamanho da tela
      const isMobileView = window.innerWidth < 768
      deviceTypeStore.setDeviceType(isMobileView ? "mobile" : "desktop")
    }

    // Verificar inicialmente
    checkDeviceType()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkDeviceType)

    // Inscrever-se para atualizações do store
    const unsubscribe = deviceTypeStore.subscribe(() => {
      setLocalDeviceType(deviceTypeStore.getDeviceType())
    })

    // Limpar listeners
    return () => {
      window.removeEventListener("resize", checkDeviceType)
      unsubscribe()
    }
  }, [])

  const setDeviceType = (type: DeviceType) => {
    deviceTypeStore.setDeviceType(type)
  }

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isDesktop: deviceType === "desktop",
    setDeviceType,
  }
}
