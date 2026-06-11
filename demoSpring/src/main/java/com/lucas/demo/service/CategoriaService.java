package com.lucas.demo.service;

import com.lucas.demo.dto.CategoriaResponseDTO;
import com.lucas.demo.exception.EntityNotFoundException;
import com.lucas.demo.model.CategoriaModel;
import com.lucas.demo.model.LoginModel;
import com.lucas.demo.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

    public CategoriaResponseDTO salvar(CategoriaModel categoria) {
        LoginModel usuarioLogado = obterUsuarioLogado();

        categoria.setCategoria(categoria.getCategoria().trim());
        categoria.setDescricao(categoria.getDescricao().trim());
        categoria.setValor(normalizarValorMonetario(categoria.getValor()));
        categoria.setUsuario(usuarioLogado);

        return new CategoriaResponseDTO(repository.save(categoria));
    }

    public CategoriaResponseDTO atualizar(Long id, CategoriaModel dadosAtualizados) {
        LoginModel usuarioLogado = obterUsuarioLogado();
        CategoriaModel categoriaExistente = repository.findById(id)
                .filter(categoria -> categoria.getUsuario() != null
                        && categoria.getUsuario().getId().equals(usuarioLogado.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Categoria nao encontrada para edicao."));

        categoriaExistente.setCategoria(dadosAtualizados.getCategoria().trim());
        categoriaExistente.setDescricao(dadosAtualizados.getDescricao().trim());
        categoriaExistente.setValor(normalizarValorMonetario(dadosAtualizados.getValor()));

        return new CategoriaResponseDTO(repository.save(categoriaExistente));
    }

    public CategoriaResponseDTO buscarPorIdDoUsuarioLogado(Long id) {
        LoginModel usuarioLogado = obterUsuarioLogado();
        CategoriaModel categoria = repository.findById(id)
                .filter(item -> item.getUsuario() != null
                        && item.getUsuario().getId().equals(usuarioLogado.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Categoria nao encontrada."));

        return new CategoriaResponseDTO(categoria);
    }

    public List<CategoriaResponseDTO> listarCategoriasDoUsuarioLogado() {
        LoginModel usuarioLogado = obterUsuarioLogado();
        return repository.findByUsuarioId(usuarioLogado.getId())
                .stream()
                .map(CategoriaResponseDTO::new)
                .toList();
    }

    private LoginModel obterUsuarioLogado() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return (LoginModel) auth.getPrincipal();
    }

    private BigDecimal normalizarValorMonetario(BigDecimal valor) {
        if (valor == null) {
            return null;
        }

        return valor.setScale(2, RoundingMode.HALF_UP);
    }
}
